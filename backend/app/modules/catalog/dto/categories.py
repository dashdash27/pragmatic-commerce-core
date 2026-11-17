from typing import TypedDict


class CategoryCreateDTO(TypedDict):
    name: str
    parent_id: int | None


class CategoryUpdateDTO(TypedDict):
    id: int
    name: str
    parent_id: int | None


class CategoryOutputDTO(TypedDict):
    id: int
    name: str
    slug: str
    parent_id: int | None
