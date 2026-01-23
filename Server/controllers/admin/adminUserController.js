const {
  createUserService,
  editUserService,
  deactiveUserService,
  getAllUsersService,
  getAllDeactiveUsersService,
} = require("../../services/admin/adminUserService");

const createUserController = async (req, res) => {
  try {
    const profilePic = req.file?.path || null;
    const leaves =
      typeof req.body.leaves === "string"
        ? JSON.parse(req.body.leaves)
        : req.body.leaves;
    const bank =
      typeof req.body.bank === "string"
        ? JSON.parse(req.body.bank)
        : req.body.bank;

    const payLoad = {
      ...req.body,
      leaves,
      bank,
      profilePic,
    };
    const result = await createUserService(payLoad, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("CREATE USER ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const editUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    const profilePic = req.file?.path;
    const leaves =
      typeof req.body.leaves === "string"
        ? JSON.parse(req.body.leaves)
        : req.body.leaves;
    const bank =
      typeof req.body.bank === "string"
        ? JSON.parse(req.body.bank)
        : req.body.bank;

    const payLoad = {
      ...req.body,
      ...(profilePic && { profilePic }),
      ...(leaves && { leaves }),
      ...(bank && { bank }),
    };

    const result = await editUserService(userId, payLoad, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("EDIT USER ERROR: ", error);
    return res.status(300).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deactiveUserController = async (req, res) => {
  const { userId } = req.params;
  const result = await deactiveUserService(userId, req.admin);
  return res.status(result.status).json(result);
};

const getAllusersController = async (req, res) => {
  try {
    const result = await getAllUsersService(req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllDeactiveUsersController = async (req, res) => {
  try {
    const result = await getAllDeactiveUsersService(req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createUserController,
  editUserController,
  deactiveUserController,
  getAllusersController,
  getAllDeactiveUsersController,
};
