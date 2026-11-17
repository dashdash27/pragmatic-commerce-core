import logging

from slugify import slugify
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..dto.categories import CategoryCreateDTO, CategoryOutputDTO, CategoryUpdateDTO
from ..exceptions.categories import (
    CategoryCycleError,
    CategoryNotFoundError,
    InvalidCategoryNameError,
    ParentCategoryNotFoundError,
)
from ..models import CategoryModel

logger = logging.getLogger(__name__)


class CategoryService:
    def __init__(self, db_session: AsyncSession | None = None):
        self.db = db_session

    async def _validate_parent(
        self, category_id: int, new_parent_id: int | None
    ) -> None:
        if new_parent_id is None:
            return

        if new_parent_id == category_id:
            raise CategoryCycleError()

        current_parent_id: int | None = new_parent_id
        visited: set[int] = {category_id}

        while current_parent_id is not None:
            if current_parent_id in visited:
                raise CategoryCycleError()
            visited.add(current_parent_id)

            stmt = select(CategoryModel.parent_id).where(
                CategoryModel.id == current_parent_id
            )
            res = await self.db.execute(stmt)
            row = res.one_or_none()

            if row is None:
                raise ParentCategoryNotFoundError()

            current_parent_id = row[0]

    async def create_category(self, dto: CategoryCreateDTO) -> CategoryOutputDTO:
        # 1. Generate slug
        base_slug = slugify(dto["name"])
        if not base_slug:
            raise InvalidCategoryNameError()

        final_slug = base_slug
        counter = 1
        while True:
            stmt = select(CategoryModel.id).where(CategoryModel.slug == final_slug)
            res = await self.db.execute(stmt)
            if not res.scalar_one_or_none():
                break
            final_slug = f"{base_slug}-{counter}"
            counter += 1

        # 2. Check parent
        parent_id = dto.get("parent_id")
        if parent_id is not None:
            stmt = select(CategoryModel.id).where(CategoryModel.id == parent_id)
            res = await self.db.execute(stmt)
            if not res.scalar_one_or_none():
                raise ParentCategoryNotFoundError()

        # 3. Create category
        db_category = CategoryModel(
            name=dto["name"], slug=final_slug, parent_id=dto["parent_id"]
        )
        self.db.add(db_category)
        await self.db.commit()

        logger.info(
            "Категория создана: id=%s, name='%s', slug=%s",
            db_category.id,
            db_category.name,
            db_category.slug,
        )

        return CategoryOutputDTO(
            id=db_category.id,
            name=db_category.name,
            slug=db_category.slug,
            parent_id=db_category.parent_id,
        )

    async def update_category(self, dto: CategoryUpdateDTO) -> CategoryOutputDTO:
        # 1. Check category
        category_id = dto["id"]
        stmt = select(CategoryModel).where(CategoryModel.id == category_id)
        res = await self.db.execute(stmt)
        db_category = res.scalar_one_or_none()

        if db_category is None:
            raise CategoryNotFoundError(category_id)

        # 2. Check new parent
        await self._validate_parent(category_id, dto["parent_id"])

        # 3. Update
        db_category.name = dto["name"]
        db_category.parent_id = dto["parent_id"]

        await self.db.commit()

        logger.info(
            "Категория обновлена: id=%s, name='%s', slug=%s",
            db_category.id,
            db_category.name,
            db_category.slug,
        )

        return CategoryOutputDTO(
            id=db_category.id,
            name=db_category.name,
            slug=db_category.slug,
            parent_id=db_category.parent_id,
        )

    async def get_all_categories(self) -> list[CategoryOutputDTO]:
        result = await self.db.execute(select(CategoryModel).order_by(CategoryModel.id))
        return [
            CategoryOutputDTO(id=c.id, name=c.name, slug=c.slug, parent_id=c.parent_id)
            for c in result.scalars().all()
        ]
