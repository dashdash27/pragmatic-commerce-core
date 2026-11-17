from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from ..dto.categories import CategoryCreateDTO, CategoryUpdateDTO
from ..schemas.categories import (
    CategoryCreateRequest,
    CategoryResponse,
    CategoryUpdateRequest,
)
from ..services.categories import CategoryService

router = APIRouter(prefix="/categories", tags=["Categories"])


def get_category_service(db: AsyncSession = Depends(get_db)) -> CategoryService:
    return CategoryService(db)


@router.post("", response_model=CategoryResponse)
async def create_category(
    payload: CategoryCreateRequest,
    category_service: CategoryService = Depends(get_category_service),
):
    dto = CategoryCreateDTO(name=payload.name, parent_id=payload.parent_id)
    return await category_service.create_category(dto)


@router.patch("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    payload: CategoryUpdateRequest,
    category_service: CategoryService = Depends(get_category_service),
):
    dto = CategoryUpdateDTO(
        id=category_id, name=payload.name, parent_id=payload.parent_id
    )
    return await category_service.update_category(dto)


@router.get("", response_model=list[CategoryResponse])
async def list_categories(
    category_service: CategoryService = Depends(get_category_service),
):
    return await category_service.get_all_categories()
