-- CreateTable
CREATE TABLE "import_socket_client" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "file_id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_import_socket_client" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "import_socket_client" ADD CONSTRAINT "fk_import_socket_client_import_file" FOREIGN KEY ("file_id") REFERENCES "import_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
