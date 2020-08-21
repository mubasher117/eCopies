import AsyncStorage from "@react-native-community/async-storage";
export const emailValidator = email => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'Ooops! We need a valid email address.';

  return '';
};

export const passwordValidator = password => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';

  return '';
};

export const nameValidator = name => {
  if (!name || name.length <= 0) return 'Name cannot be empty.';

  return '';
};
export const nameValidator2 = (name) => {
  if (!name || name.length <= 0) return "* Name cannot be empty.";
  else if (/^[a-zA-Z .]*$/.test(name) == false)
         return "* Name shlould be alphabet only";
  return "";
};



export const getUserId = () =>
  new Promise(async (resolve, reject) => {
    let storedUser = await AsyncStorage.getItem("@loggedUser");
    try {
      storedUser = JSON.parse(storedUser);
    } catch (error) {
      console.log("Error in parsing userId ");
    }
    if (storedUser) {
      console.log("STORED ID FOUND:   ", storedUser.user.uid);
      resolve(storedUser.user.uid);
    }
  });
