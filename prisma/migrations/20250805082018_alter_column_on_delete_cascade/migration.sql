-- DropForeignKey
ALTER TABLE "public"."recipes" DROP CONSTRAINT "recipes_requirement_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."recipes" DROP CONSTRAINT "recipes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."requirements" DROP CONSTRAINT "requirements_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviews" DROP CONSTRAINT "reviews_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."saved_recipes" DROP CONSTRAINT "saved_recipes_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."saved_recipes" DROP CONSTRAINT "saved_recipes_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."requirements" ADD CONSTRAINT "requirements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipes" ADD CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipes" ADD CONSTRAINT "recipes_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "public"."requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_recipes" ADD CONSTRAINT "saved_recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_recipes" ADD CONSTRAINT "saved_recipes_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
