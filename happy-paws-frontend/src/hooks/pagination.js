import { useState, useMemo } from 'react';

export default function usePagination(data, itemsPerPage) {
    const [page, setPage] = useState(1);

    const totalPages = useMemo(
        () => Math.ceil(data.length / itemsPerPage),
        [data.length, itemsPerPage]
    );

    const currentItems = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }, [data, page, itemsPerPage]);

    const nextPage = () => {
        setPage(p => Math.min(p + 1, totalPages));
    };

    const prevPage = () => {
        setPage(p => Math.max(p - 1, 1));
    };

    return { page, totalPages, currentItems, nextPage, prevPage };
}

