const { status } = require("init")

const adminCheck = (admin) => {
    if(!admin || admin.role !== "ADMIN"){
        return {
            status: 403,
            success: false,
            message: "Only admin can perform this action"
        }
    }
}

module.exports = adminCheck