export function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export function CheckQueryPagingParams(query: any, defaultPageSize = 20, defaultPageNumber = 1) {
    let { page, limit } = query;
    page = !page || isNaN(page) ? defaultPageNumber : Number(page);
    limit = !limit || isNaN(limit) ? defaultPageSize : Number(limit);

    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 1 : limit;

    return { page, limit, offset: (page - 1) * limit }
}