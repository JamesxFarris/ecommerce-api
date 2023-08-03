const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ error: "Couldn't grab what you wanted." });
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: "tag_products" }],
    });
    if (!categoryData) {
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    // Catch any errors
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category." });
  }
  // be sure to include its associated Product data
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ error: "Couldn't grab what you wanted." });
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const [rowsUpdated, [updatedTag]] = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });
    if (!rowsUpdated) {
      return res.status(404).json({ message: "No tag found with that id!" });
    }
    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(500).json({ error: "Couldn't grab what you wanted." });
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      return res.status(404).json({ message: "No tag found with that id!" });
    }
    res.status(200).json({ message: "Tag deleted." });
  } catch (err) {
    res.status(500).json({ error: "Couldn't grab what you wanted." });
  }
});

module.exports = router;
