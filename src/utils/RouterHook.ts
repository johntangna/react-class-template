import { useLocation } from "react-router";

class RouterHook {

  getCurrentRouter() {
    return {
      ...location,
    }
  }

  goToUrl(url: string) {
    window.location.href = `${window.location.origin}/#/`
  }
} 

export default new RouterHook()