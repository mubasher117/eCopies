import AsyncStorage from "@react-native-community/async-storage";
export const emailValidator = email => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return '* Email cannot be empty.';
  if (!re.test(email)) return '* Enter a valid email address.';

  return '';
};

export const passwordValidator = (password) => {
  if (!password || password.length <= 0) return "* Password cannot be empty.";
  if (password.length < 6) return "* Password must be more than 6 digits"
  return "";
};
export const cellNoValidator = (cellNo) => {
  if (!cellNo || cellNo.length <= 0) return "* Cell Number cannot be empty."; 
  if (cellNo[0] != "0" || cellNo[1] != "3" || cellNo.length != 11){
  return "* Format should be 03XXXXXXXXX"
  }
  return "";
};
export const addressValidator = (address) => {
  if (!address || address.length <= 0) return "* Address cannot be empty.";
  return "";
};

export const nameValidator = name => {
  if (!name || name.length <= 0) return 'Name cannot be empty.';

  return '';
};
export const nameValidator2 = (name) => {
  if (!name || name.length <= 0) return "* Name cannot be empty.";
  else if (/^[a-zA-Z .]*$/.test(name) == false)
         return "* Name shlould be alphabets only";
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
