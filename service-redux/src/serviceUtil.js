import React from 'react';

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
 * 注入服务的高阶组件，目前react的hooks是不能发布到npm上的
 */
class ServiceProvider extends React.Component {

  state = {
    contextValue: {}
  }

  unsubscribeList = [];

  componentDidMount() {
    const { services } = this.props;
    const { contextValue } = this.state;
    
    this.setState({
      contextValue: {
        ...contextValue,
        ...services
      }
    }, () => {
      Object.keys(services).forEach((key) => {
        const unsubscribe = services[key].subscribe(_data => {
          const { contextValue } = this.state;
          this.setState({
            contextValue: {
              ...contextValue,
              ..._data
            }
          });
        });
        this.unsubscribeList.push(unsubscribe);
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribeList.forEach(unsubscribe => {
      typeof unsubscribe === 'function' && unsubscribe();
    });
  }

  render() {
    const Context = getContext();
    const { contextValue } = this.state;
    const { children } = this.props;
    return <Context.Provider value={contextValue}>{children}</Context.Provider>
  }
}


// function ServiceProvider({ services = {}, children = null }) {
//   const Context = getContext();
//   const [contextValue, setContextValue] = useState({
//     ...services
//   });
//   const unsubscribeList = [];

//   useEffect(() => {
//     Object.keys(services).forEach((key) => {
//       const unsubscribe = services[key].subscribe(_data => {
//         setContextValue({
//           ...contextValue,
//           ..._data
//         });
//       });
//       unsubscribeList.push(unsubscribe);
//     });

//     return () => {
//       unsubscribeList.forEach(unsubscribe => {
//         typeof unsubscribe === 'function' && unsubscribe();
//       });
//     }
//   }, [])

//   return (
//     <Context.Provider value={contextValue}>{children}</Context.Provider>
//   )
// }

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