import React, { useEffect, useState } from 'react';

// 获取唯一的context
const getContext = (() => {
  const Context = React.createContext(null);
  Context.displayName = 'serviceProvider';

  return () => {
    return Context;
  }
})();

const defaultMapStateToProps = (data) => {
  return {
    ...data
  };
}

/**
 * 注入服务的高阶组件
 */
function ServiceProvider({ services = {}, children = null }) {
  const Context = getContext();
  const [contextValue, setContextValue] = useState({
    ...services
  });
  const unsubscribeList = [];

  useEffect(() => {
    Object.keys(services).forEach((key) => {
      const unsubscribe = services[key].subscribe(_data => {
        setContextValue({
          ...contextValue,
          ..._data
        });
      });
      unsubscribeList.push(unsubscribe);
    });

    return () => {
      unsubscribeList.forEach(unsubscribe => {
        typeof unsubscribe === 'function' && unsubscribe();
      });
    }
  }, [])

  return (
    <Context.Provider value={contextValue}>{children}</Context.Provider>
  )
}

const inject = (mapStateToProps = defaultMapStateToProps) => {
  const Context = getContext();

  return (Component) => (props) => {

    return (
      <Context.Consumer>
        {
          data => {
            const newProps = mapStateToProps(data);
            return <Component {...props} {...newProps} />
          }
        }
      </Context.Consumer>
    )
  }
}

export {
  ServiceProvider,
  inject
}