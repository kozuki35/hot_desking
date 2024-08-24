import axiosInstance from '@/utils/axiosInstance';

export const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, data: {}) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const createUser = async (data: {}) => {
  try {
    const response = await axiosInstance.post('/users/signup', data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
