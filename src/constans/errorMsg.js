const msg = {
  401: { message: 'Login Timeout' },
  403: { message: 'No permission' },
  404: { message: 'The request does not exist' },
  500: { message: 'Opps~ Something Wrong', description: 'please try again.' },
  504: { sameWith: 500 },

  5001: { sameWith: 5005 },
  5003: {
    message: "Where's the Info?",
    description: 'Please confirm the ID has already registered.',
  },
  5002: { sameWith: 5005 },
  5004: { sameWith: 5005 },
  5005: {
    message: 'Failed in Saving Changes',
    description: 'We got a problem when saving your changes, please try again later.',
  },
  5007: {
    message: 'Failed in Initialization',
  },
  5008: {
    message: 'ID Already Exists',
    description: 'Try to use a new ID.',
  },
};

const msgProxy = new Proxy(msg, {
  get: (target, key) => {
    let val = target[key];

    if (val && val.sameWith) {
      val = target[val.sameWith];
    }

    let desc = (val && val.description) || '';

    desc = desc.indexOf('{{code}}') > -1 ? desc.replace(/\{\{code\}\}/, key) : desc;

    return val && { ...val, description: desc };
  },
});

export default msgProxy;
