interface Form {
  [key: string]: any;
}

const formToJSON = (data: FormData) => {
  let object: Form = {};
  data.forEach((value, key) => (object[key] = value));
  return object;
};

export default formToJSON;
