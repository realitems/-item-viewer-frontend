export default ({ store, $axios }, inject) => {
  inject("getItem", (itemId) => {
    const data = JSON.stringify({
      itemId,
    });

    const config = {
      method: "post",
      url: store.state.PROXY_URL,
      headers: {
        "content-type": "application/json",
        "x-function-name": "getItem",
      },
      data,
    };

    return $axios(config);
  });
};
