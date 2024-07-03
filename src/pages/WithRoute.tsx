import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { h } from "..";

export interface RouterProps {
  router: {
    location: Location
    navigate: Function
    params: {
      [key: string]: string | number | boolean
    }
  }
}

export function withRouter(Component: any) {
  function ComponentWithRouterProp(props: any) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}