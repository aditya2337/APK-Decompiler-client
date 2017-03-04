const Auth = {
  isAuthenticated: false,
  isFetching: true,
  mapStateToProps (state) {
    const { selectedSession, postsBySession } = state;
    const {
      isFetching,
      lastUpdated,
      items: posts
    } = postsBySession['undefined'] || {
      isFetching: true,
      items: []
    };

    return {
      selectedSession,
      posts,
      isFetching,
      lastUpdated
    };
  }
};

export default Auth;
