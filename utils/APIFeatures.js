class APIFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    const queryObj = {...this.reqQuery};
    const excludedFields = ['page', 'limit', 'fields', 'sort'];
    excludedFields.forEach(field => delete queryObj[field]);

    const updQuery = JSON.parse(
      JSON.stringify(queryObj)
      .replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
    );

    this.query = this.query.find(updQuery);
    return this;
  }
  
  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); 
    } else {
      this.query = this.query.sort('createdAt');
    }
    return this;
  }

  fields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(',').join(' ');
      this.query = this.query.select(fields); 
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  limit() {
    const limit = this.reqQuery.limit || 4;
    const page = this.reqQuery.page || 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(+limit);
    return this;
  }
}

module.exports = APIFeatures;