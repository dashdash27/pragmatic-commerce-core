from fastapi import status

from app.core.exceptions import BaseApplicationError


class CatalogModuleError(BaseApplicationError):
    pass


class InvalidCategoryNameError(CatalogModuleError):
    def __init__(self, message: str = "Недопустимое название категории"):
        super().__init__(
            message=message,
            code="INVALID_CATEGORY_NAME",
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class ParentCategoryNotFoundError(CatalogModuleError):
    def __init__(self, message: str = "Родительская категория не найдена"):
        super().__init__(
            message=message,
            code="PARENT_CATEGORY_NOT_FOUND",
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class CategoryNotFoundError(CatalogModuleError):
    def __init__(self, message: str = "Категория не найдена"):
        super().__init__(
            message=message,
            code="CATEGORY_NOT_FOUND",
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class CategoryCycleError(CatalogModuleError):
    def __init__(
        self,
        message: str = "Родителем категории не могут бы ее потомки. Категория не может быть своим родителем.",
    ):
        super().__init__(
            message=message,
            code="CATEGORY_CYCLE_ERROR",
            status_code=status.HTTP_400_BAD_REQUEST,
        )
