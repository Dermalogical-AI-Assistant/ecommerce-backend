import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { IngredientAnalysis } from '../product.dto';

@Injectable()
export class IngredientService {
  private readonly COSMILY_ANALYZE_URL = 'https://api.cosmily.com/api/v1/analyze/ingredient_list';

  public async getIngredientsAnalysis(fullIngredients: string): Promise<IngredientAnalysis> {
    if (!fullIngredients || fullIngredients === 'null') {
      return null;
    }

    try {
      const { data } = await axios.post(this.COSMILY_ANALYZE_URL, {
        ingredients: fullIngredients,
      });

      const analysis = data.analysis;
      return this.preprocessIngredientsAnalysis(analysis);
    } catch (error) {
      throw new HttpException('Failed to analyze ingredients', HttpStatus.BAD_REQUEST);
    }
  }

  private preprocessIngredientsAnalysis(data: any): any {
    data.text = this.preprocessHtmlContent(data.text);
    data.ingredients_table = (data.ingredients_table || [])
      .filter(Boolean)
      .map((i) => ({...i, introtext: this.preprocessHtmlContent(i.introtext)}));
    return data;
  }

  private preprocessHtmlContent(htmlContent: any): string {
    if (typeof htmlContent === 'string') {
      const $ = cheerio.load(htmlContent);
      return $.text();
    }
    return htmlContent;
  }
}
