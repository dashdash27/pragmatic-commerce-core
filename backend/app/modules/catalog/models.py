from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class CategoryModel(Base):
    __tablename__ = "catalog_categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)

    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("catalog_categories.id", ondelete="SET NULL"), nullable=True
    )

    # relationships
    parent: Mapped["CategoryModel | None"] = relationship(
        "CategoryModel",
        remote_side=[id],
        back_populates="children",
        lazy="raise",
    )
    children: Mapped[list["CategoryModel"]] = relationship(
        "CategoryModel",
        back_populates="parent",
        lazy="raise",
    )
