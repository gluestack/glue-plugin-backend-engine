const axios = require('axios');

module.exports = async (callbacks, payload) => {

  console.log({callbacks, payload});

  for await (const callback of callbacks) {
    const { value } = callback;

    const [ serviceAppId, serviceMethod ] = value.split('::');
    if (!serviceAppId || !serviceMethod) {
      console.log(`Missing service app id or method from ${value}`);
      continue;
    }

    try {
      const appId = serviceAppId.replace(/-/g, '');

      await axios({
        method: 'post',
        url: `http://${appId}:9000/${serviceMethod}`,
        data: payload,
        headers: {},
      });
    } catch (err) {
      console.log(`Error invoking ${serviceAppId}::${serviceMethod}: ${err}`);
      continue;
    }
  }
};
