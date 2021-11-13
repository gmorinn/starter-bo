import { useMemo } from 'react'
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom'

const useRouter = () => {
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();

    return useMemo(() => {
        return {
            push: history.push, // Change Url
            replace: history.replace,
            pathname: location.pathname, // Path of URL
            query: {
                ...params, // useParam :id
            },
            match, //Racine Url
            location,
            history
        }
    }, [params, location, history, match])
}

export default useRouter
