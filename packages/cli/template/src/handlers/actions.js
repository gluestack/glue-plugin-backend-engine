/**
 * This function is the entry point for the gluestack actions.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *
 * @returns {Promise<void>}
 */
const axios = require('axios');

module.exports = async (req, res) => {
  if ( !req.params || !req.params.action_name ) {
    return res.status(500).json({
      status: false,
      message: '"action_name" is missing from request params'
    });
  }

  if ( !req.body.action ) {
    return res.status(500).json({
      status: false,
      message: '"action" is missing from request body'
    });
  }

  const { headers, body } = req;
  if (headers["content-length"]) delete headers["content-length"];

  const serviceAppId = req.params.action_name;
  const serviceMethod = body.action.name;

  try {
    const { data } = await axios({
      method: req.method,
      url: `http://${serviceAppId}:9000/${serviceMethod}`,
      data: body,
      headers: headers,
    });
    return res.status(200).json(data);
  } catch (err) {
    console.log(`Error invoking action ${serviceAppId}::${serviceMethod}: ${err}`);
    return res.status(500).json({
      status: false,
      ...err.message
    });
  }
};
