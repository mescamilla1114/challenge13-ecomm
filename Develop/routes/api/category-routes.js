const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const catData = await Category.findAll({
    include: [{ model: Product/*, through: ProductTag, as: 'pro_tags'*/ }]
    });
    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const catData = await Category.findByPk(req.params.id,{
    include: [{ model: Product/*, through: ProductTag, as: 'pro_tags'*/ }]
    });
    if (!catData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const catData = await Category.create(req.body);
    res.status(200).json(catData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return cats.findAll({ where: { category_id: req.params.id } });
    })
    .then((cats) => {
      // get list of current tag_ids
      const catName= cats.map(({ category_id }) => category_id);
      // create filtered list of new tag_ids
      const newCatname = req.body.cats
        .filter((category_id) => !cats.includes(category_id))
        .map((category_id) => {
          return {
            category_id: req.params.id,
            category_id,
          };
        });
      // figure out which ones to remove
      const categoriesToRemove = cats
        .filter(({ category_id }) => !req.body.cats.includes(category_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        cats.destroy({ where: { id: categoriesToRemove } }),
        catName.bulkCreate(newCatname),
      ]);
    })
    .then((updatedcategory) => res.json(updatedcategory))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async(req, res) => {
  // delete a category by its `id` value
  try {
    const catData = await Category.destroy({
      where: { id: req.params.id }
    });
    if (!catData) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
