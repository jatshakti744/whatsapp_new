import axios from "axios";
import * as config from "../utils/config";

export async function AddMember(data) {
  try {
    const token = localStorage.getItem("tokenjwt");
    const response = await axios.post(`${config.base_url}user/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error adding member:", error.response || error);
    throw error;
  }
}

export async function EditMember(data) {
  try {
    const token = localStorage.getItem("tokenjwt");
    const response = await axios.put(`${config.base_url}user/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error adding member:", error.response || error);
    throw error;
  }
}

export async function MemberList() {
  try {
    const token = localStorage.getItem("tokenjwt");

    const response = await axios.get(`${config.base_url}user/lists`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error fetching member list:", error?.message || error);
    throw error;
  }
}

export async function MemberDetail(id) {
  try {
    const token = localStorage.getItem("tokenjwt");

    const response = await axios.get(`${config.base_url}user/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching member detail:", error.response || error);
    throw error;
  }
}

export async function DeleteMember(id) {
  const token = localStorage.getItem("tokenjwt");

  const res = await axios.get(`${config.base_url}user/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function UpdateMemberStatus(id, status) {
  const token = localStorage.getItem("tokenjwt");

  const res = await axios.post(
    `${config.base_url}user/change-status`,
    { id, status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return res.data;
}

export async function ClientList(data) {
  try {
    const token = localStorage.getItem("tokenjwt");

    const response = await axios.post(
      `${config.base_url}client/listwithfilter`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log("Error fetching client list:", error.response || error);
    throw error;
  }
}

export async function AddClient(data) {
  try {
    const token = localStorage.getItem("tokenjwt");
    const response = await axios.post(`${config.base_url}client/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error adding client:", error.response || error);
    return error.response?.data;
  }
}

export async function ClientDetail(id) {
  try {
    const token = localStorage.getItem("tokenjwt");

    const response = await axios.get(`${config.base_url}client/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching client detail:", error.response || error);
    throw error;
  }
}

export async function EditClient(data) {
  try {
    const token = localStorage.getItem("tokenjwt");
    const response = await axios.put(`${config.base_url}client/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error adding client:", error.response || error);
    return error.response?.data;
  }
}

export async function DeleteClient(id, add_by) {
  const token = localStorage.getItem("tokenjwt");

  const res = await axios.get(
    `${config.base_url}client/delete/${id}/${add_by}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
}

export async function UpdateClientStatus(id, status, add_by) {
  const token = localStorage.getItem("tokenjwt");

  const res = await axios.post(
    `${config.base_url}client/change-status`,
    { id, status, add_by },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return res.data;
}

export async function GetActiveUser(token) {
  try {
    const response = await axios.get(`${config.base_url}user/activeuser`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response?.data;
  } catch (error) {
    console.log("Error Update Permission", error);
    throw error;
  }
}

export async function ChangeClientOwner(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}client/change-owner`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.log("Error changing client owner:", error.response || error);
    throw error;
  }
}

export async function GetCRMCContactWithFilter(token, data) {
  try {
    console.log("Data", data);
    console.log("token", token);

    const response = await axios.post(
      `${config.base_url}user/getallclients`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.log("Error while finding CRM Contact", error);
    return error;
  }
}

export async function MSGSend(token, formData) {
  try {
    const response = await axios.post(
      `${config.live_url}whatsapp/send`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.log("Error while Chat", error);
    return error;
  }
}

export async function GetChatHistoryByPhone(token, phoneno, crm_user_id) {
  try {
    const response = await axios.get(
      `${config.base_url}whatsapp/getchathistorybyphones/${phoneno}/${crm_user_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.log("Error while getting chat history", error);
    return error;
  }
}

export async function GetLatestChat(token, crm_user_id, search = "") {
  try {
    const response = await axios.get(
      `${config.base_url}whatsapp/getchatuserlistfromclient`,
      {
        params: {
          crm_user_id,
          search,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response?.data;
  } catch (error) {
    console.log("Error while getting latest chat list", error);
    return error;
  }
}

export async function GetUnassignContact(token, payload) {
  try {
    const response = await axios.post(
      `${config.base_url}user/getcrmcontactwithfilterunassignwithclient`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response?.data;
  } catch (error) {
    console.log("Error while getting unassign chat list", error);
    return error;
  }
}

export async function GetUnassignContactDownload(token, payload) {
  try {
    const response = await axios.post(
      `${config.base_url}user/getcrmcontactwithfilterunassignallwithclient`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response?.data;
  } catch (error) {
    console.log("Error while getting unassign chat list", error);
    return error;
  }
}

export async function GetTemplateList(token) {
  try {
    const response = await axios.get(`${config.base_url}whatstemplate/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response?.data;
  } catch (error) {
    console.log("Error while getting template list", error);
    return error;
  }
}

export async function StatusChange(data, token) {
  try {
    const response = await axios.put(
      `${config.base_url}whatstemplate/change_status`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log("Status update error", error);
    return { status: false };
  }
}

export async function DeleteTemplate(id, token) {
  try {
    const response = await axios.get(
      `${config.base_url}whatstemplate/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log("Status update error", error);
    return { status: false };
  }
}

export async function AddTemplateApi(data, token) {
  try {
    const response = await axios.post(
      `${config.base_url}whatstemplate/add`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.log("Error adding member:", error.response || error);
    throw error;
  }
}

export async function EditTemplateApi(data) {
  try {
    const response = await axios.put(
      `${config.base_url}whatstemplate/update`,
      data,
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.log("Error adding member:", error.response || error);
    throw error;
  }
}

export async function GetTemplateById(id, token) {
  try {
    const response = await axios.get(
      `${config.base_url}whatstemplate/detail/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.log("Error adding member:", error.response || error);
    throw error;
  }
}

export async function GetActiveTemplateList(token) {
  try {
    const response = await axios.get(
      `${config.base_url}whatstemplate/active_list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.log("Error while getting active template list", error);
    return error;
  }
}

export async function SendBulkTemplate(token, payload) {
  try {
    const response = await axios.post(
      `${config.live_url}whatsapp/sendbluk`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.log("Error while sending bulk template", error);
    return error.response?.data;
  }
}

export async function AddBulkClient(token, formData) {
  try {
    const response = await axios.post(
      `${config.base_url}client/bulkuploadclients`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log("Bulk client upload error", error);
    return error.response?.data;
  }
}
