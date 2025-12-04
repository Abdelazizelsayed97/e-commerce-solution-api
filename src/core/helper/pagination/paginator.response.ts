export class Paginator {
  static getSkip(page: number, limit: number) {
    const safePage = page < 1 ? 1 : page;
    return (safePage - 1) * limit;
  }

  static async paginate<T>(
    repo: any,
    options: {
      page: number;
      limit: number;
      where?: any;
      order?: any;
      relations?: string[];
    },
  ) {
    const { page, limit, where, order, relations } = options;

    const skip = this.getSkip(page, limit);

    const [items, totalItems] = await repo.findAndCount({
      where,
      order,
      relations,
      skip,
      take: limit,
    });
    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };  
  }
}
