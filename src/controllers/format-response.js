function formatResponse(
    {contentType, statusCode, body, headers}) {
  const formattedResponse = {
    statusCode: statusCode,
    headers: headers ? headers : {},
  };
  if (body instanceof Error) {
    formattedResponse.body = {
      message: body.message,
      name: body.name,
      code: body.errorCode,
    };
    formattedResponse.headers['content-type'] = 'application/json';
  } else {
    formattedResponse.body = body;
    formattedResponse.headers['content-type'] = contentType ? contentType : 'application/json';
  }
  return formattedResponse;
}

function formatError({error}) {
  return formatResponse({
    statusCode: error.httpStatusCode,
    body: {
      message: error.message,
      name: error.name,
      code: error.errorCode,
    },
  });
}

module.exports = {formatResponse, formatError};
