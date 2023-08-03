const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  try {
    // Find all categories including associated products
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find one category by its `id` value, including associated products through ProductTag
    const categoryData = await Category.findByPk(req.params.id, {
      include: [
        { model: Product, through: ProductTag, as: "category_products" },
      ],
    });

    if (!categoryData) {
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    // Catch any errors
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category." });
  }
});

router.post("/", async (req, res) => {
  try {
    // Create a new category
    const category = await Category.create(req.body);
    res.status(201).json(category);
    // Catch any errors
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create a new category." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    // Update a category by its id
    const [rowsUpdated, [updatedCategory]] = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });

    if (rowsUpdated === 0) {
      // If no rows were updated, 404
      return res.status(404).json({ message: "Category not found." });
    }

    // Gives updated category
    res.status(200).json(updatedCategory);
    // Catch any errors
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update category." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Delete a category by id
    const rowsDeleted = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (rowsDeleted === 0) {
      // No rows deleted, 404
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted." });
    // Catch any errors
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete category." });
  }
});

module.exports = router;
