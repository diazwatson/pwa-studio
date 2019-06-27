import { useCallback, useMemo, useState } from 'react';
import { useSearchParam } from './useSearchParam';

/**
 * Sets a query parameter in history. Attempt to use React Router if provided
 * otherwise fallback to builtins.
 */
const setQueryParam = ({ location, history, parameter, value }) => {
    const { search } = location;
    const queryParams = new URLSearchParams(search);
    queryParams.set(parameter, value);

    const fn = history.push || history.pushState;
    fn({ search: queryParams.toString() });
};

/**
 * `usePagination` provides a pagination state with `currentPage` and
 * `totalPages` as well as an API for interacting with the state.
 *
 * @param {Object} location the location object, like window.location, or from react router
 * @param {Object} history the history object, like window.history, or from react router
 * @param {String} namespace the namespace to apply to the pagination query
 * @param {String} parameter the name of the query parameter to use for page
 * @param {Number} initialPage the initial current page value
 *
 * TODO update with defaults
 *
 * @returns {[PaginationState, PaginationApi]}
 */
export const usePagination = ({
    location = window.location,
    history = window.history,
    namespace = '',
    parameter = 'page',
    initialPage = 1
}) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(null);

    const setValue = useCallback(
        val => {
            // Fallback to initial value if NaN ie page='foo'.
            setCurrentPage(parseInt(val) || initialPage);
        },
        [initialPage]
    );

    useSearchParam({
        location,
        parameter: `${namespace}_${parameter}`,
        setValue
    });

    const setPage = useCallback(
        page => {
            // Update the query parameter.
            setQueryParam({
                location,
                history,
                parameter: `${namespace}_${parameter}`,
                value: page
            });

            // Update the state object.
            setCurrentPage(page);
        },
        [history, location, namespace, parameter]
    );

    /**
     * @typedef PaginationState
     * @property {Number} currentPage the current page
     * @property {Number} totalPages the total pages
     */
    const paginationState = { currentPage, totalPages };

    /**
     * @typedef PaginationApi
     * @property {Function} setCurrentPage
     * @property {Function} setTotalPages
     */
    const api = useMemo(
        () => ({
            setCurrentPage: setPage,
            setTotalPages
        }),
        [setPage, setTotalPages]
    );

    return [paginationState, api];
};
