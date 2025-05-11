import { Injectable, NotFoundException } from '@nestjs/common';
import _ from 'lodash';
import { PrismaService } from 'src/database';
import { Neo4jService } from 'src/modules/neo4j/services';
import { ProductDto } from 'src/generated';
import { IngredientService } from './ingredient.service';
import { IngredientAnalysis } from '../product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly dbContext: PrismaService,
    private readonly neo4jService: Neo4jService,
    private readonly ingredientService: IngredientService,
  ) {}

  public async validateProductExistsById(id: string) {
    const product = await this.dbContext.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    return product;
  }

  async processIngredients(productId: string, analysis: IngredientAnalysis) {
    // 1. Merge Ingredients and create HAS relationships
    for (const ingredient of analysis?.ingredients_table || []) {
      const MERGE_INGREDIENT_QUERY = `
        MERGE (i:Ingredient {id: $id})
        SET i.title = $title,
            i.cir_rating = $cir_rating,
            i.introtext = $introtext,
            i.categories = $categories,
            i.properties = $properties,
            i.integer_properties = $integer_properties,
            i.ewg = $ewg
      `;
      await this.neo4jService.write(MERGE_INGREDIENT_QUERY, {
        id: ingredient.id,
        title: ingredient.title,
        cir_rating: ingredient.cir_rating,
        introtext: ingredient.introtext,
        categories: ingredient.categories,
        properties: Object.entries(ingredient.boolean_properties)
          .filter(([_k, v]) => v === true)
          .map(([k, _v]) => k),
        integer_properties: JSON.stringify(ingredient.integer_properties ?? {}),
        ewg: JSON.stringify(ingredient.ewg ?? {}),
      });

      const CREATE_HAS_REL_QUERY = `
        MATCH (p:Product {id: $product_id})
        MATCH (i:Ingredient {id: $ingredient_id})
        MERGE (p)-[r:HAS]->(i)
        SET r.updated_at = timestamp()
      `;
      await this.neo4jService.write(CREATE_HAS_REL_QUERY, {
        product_id: productId,
        ingredient_id: ingredient.id,
      });
    }

    // 2. HARMFUL relationships
    for (const [harmType, harmData] of Object.entries(
      analysis?.harmful || {},
    )) {
      for (const item of harmData.list || []) {
        const HARMFUL_REL_QUERY = `
          MATCH (p:Product {id: $product_id})
          MATCH (i:Ingredient {title: $ingredient_title})
          OPTIONAL MATCH (p)-[existing:HARMFUL]->(i)
          WHERE existing.title = $title
          FOREACH (_ IN CASE WHEN existing IS NULL THEN [1] ELSE [] END |
            CREATE (p)-[:HARMFUL {
              title: $title,
              type: $type,
              description: $description,
              updated_at: timestamp()
            }]->(i)
          )
        `;

        await this.neo4jService.write(HARMFUL_REL_QUERY, {
          product_id: productId,
          ingredient_title: item.title,
          type: harmType,
          title: harmData.title,
          description: harmData.description,
        });
      }
    }

    // 3. POSITIVE relationships
    for (const [posType, posData] of Object.entries(analysis?.positive || {})) {
      for (const item of posData.list || []) {
        const POSITIVE_REL_QUERY = `
          MATCH (p:Product {id: $product_id})
          MATCH (i:Ingredient {title: $ingredient_title})
          OPTIONAL MATCH (p)-[existing:POSITIVE]->(i)
          WHERE existing.title = $title
          FOREACH (_ IN CASE WHEN existing IS NULL THEN [1] ELSE [] END |
            CREATE (p)-[:POSITIVE {
              title: $title,
              type: $type,
              description: $description,
              updated_at: timestamp()
            }]->(i)
          )
      `;

        await this.neo4jService.write(POSITIVE_REL_QUERY, {
          product_id: productId,
          ingredient_title: item.title,
          type: posType,
          title: posData.title,
          description: posData.description,
        });
      }
    }

    // 4. NOTABLE relationships
    for (const [notableType, notableData] of Object.entries(
      analysis?.notable || {},
    )) {
      for (const item of notableData.list || []) {
        const NOTABLE_REL_QUERY = `
          MATCH (p:Product {id: $product_id})
          MATCH (i:Ingredient {title: $ingredient_title})
          OPTIONAL MATCH (p)-[existing:NOTABLE]->(i)
          WHERE existing.title = $title
          FOREACH (_ IN CASE WHEN existing IS NULL THEN [1] ELSE [] END |
            CREATE (p)-[:NOTABLE {
              title: $title,
              type: $type,
              updated_at: timestamp()
            }]->(i)
          )
        `;

        await this.neo4jService.write(NOTABLE_REL_QUERY, {
          product_id: productId,
          ingredient_title: item.title,
          type: notableType,
          title: notableData.title,
        });
      }
    }
  }

  public async addProductToNeo4j(product: Partial<ProductDto>) {
    if (!product.fullIngredientsList) {
      const query = `
        MERGE (p:Product {id: $id})
        SET p.img = $img,
            p.title = $title,
            p.price = $price,
            p.skincare_concern = apoc.coll.toSet(COALESCE(p.skincare_concern, []) + $skincare_concern),
            p.description = $description,
            p.how_to_use = $how_to_use,
            p.ingredient_benefits = $ingredient_benefits
        RETURN p;
      `;
      const params = {
        id: product.id,
        title: product.title,
        img: product.thumbnail,
        price: product?.currency
          ? `${product.price} ${product.currency}`
          : null,
        skincare_concern: product.skincareConcerns,
        description: product?.description,
        how_to_use: product?.howToUse,
        ingredient_benefits: product?.ingredientBenefits,
      };

      const result = await this.neo4jService.write(query, params);
      return result.records[0]?.get('p').properties;
    }

    const ingredientsAnalysis =
      await this.ingredientService.getIngredientsAnalysis(
        product.fullIngredientsList,
      );

    const MERGE_PRODUCT_QUERY = `
      MERGE (p:Product {id: $id})
      SET p.img = $img,
          p.title = $title,
          p.price = $price,
          p.skincare_concern = apoc.coll.toSet(COALESCE(p.skincare_concern, []) + $skincare_concern),
          p.description = $description,
          p.how_to_use = $how_to_use,
          p.ingredient_benefits = $ingredient_benefits,
          p.full_ingredients_list = $full_ingredients_list,
          p.ewg = $ewg,
          p.natural = $natural,
          p.analysis_text = $analysis_text,
          p.analysis_description = $analysis_description
      RETURN p;
      `;

    const ewg = ingredientsAnalysis?.ewg;
    const natural = ingredientsAnalysis?.natural;
    const params = {
      id: product.id,
      title: product.title,
      img: product.thumbnail,
      price: product?.currency ? `${product.price} ${product.currency}` : null,
      skincare_concern: product.skincareConcerns || [],
      description: product?.description,
      how_to_use: product?.howToUse,
      ingredient_benefits: product?.ingredientBenefits,
      full_ingredients_list: product.fullIngredientsList,
      ewg: ewg ? JSON.stringify(ewg) : null,
      natural: natural ? JSON.stringify(natural) : null,
      analysis_text: ingredientsAnalysis?.text,
      analysis_description: ingredientsAnalysis?.description,
    };
    const result = await this.neo4jService.write(MERGE_PRODUCT_QUERY, params);

    await this.processIngredients(product.id, ingredientsAnalysis);
    return result.records[0]?.get('p').properties;
  }

  public async updateProductInNeo4j(
    product: Partial<ProductDto>,
    isChangeFullIngredientsList: boolean = false,
  ) {
    if (Object.keys(product).length === 0) {
      throw new Error('No update data provided');
    }

    if (isChangeFullIngredientsList) {
      await this.deleteProductFromNeo4j(product.id);
      await this.addProductToNeo4j(product);
      return;
    }

    const params = {
      id: product.id,
      title: product.title,
      img: product.thumbnail,
      price: product?.currency ? `${product.price} ${product.currency}` : null,
      skincare_concern: product.skincareConcerns,
      description: product?.description,
      how_to_use: product?.howToUse,
      ingredient_benefits: product?.ingredientBenefits,
    };

    const UPDATE_PRODUCT_QUERY = `
      MERGE (p:Product {id: $id})
      SET p.img = $img,
          p.title = $title,
          p.price = $price,
          p.skincare_concern = apoc.coll.toSet(COALESCE(p.skincare_concern, []) + $skincare_concern),
          p.description = $description,
          p.how_to_use = $how_to_use,
          p.ingredient_benefits = $ingredient_benefits
    `;

    const result = await this.neo4jService.write(UPDATE_PRODUCT_QUERY, params);

    if (result.records.length === 0) {
      throw new NotFoundException('Product not found in Neo4j');
    }

    return result.records[0].get('p').properties;
  }

  public async deleteProductFromNeo4j(id: string) {
    const DELETE_PRODUCT_QUERY = `
      MATCH (p:Product {id: $id})
      DETACH DELETE p
    `;
    await this.neo4jService.write(DELETE_PRODUCT_QUERY, { id });
    return { message: 'Product deleted from Neo4j' };
  }
}
