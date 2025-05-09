import axios from "axios";
import { IPostCatalog } from "@/types/type/post-catalog";

export const getAllPostCatalogs = async (): Promise<IPostCatalog[]> => {
  try {
    const res = await axios.get("/api/post-catalog");
    return res.data.data;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách danh mục:", err);
    throw new Error("Không thể lấy danh sách danh mục");
  }
};

export const createPostCatalog = async (
  data: Partial<IPostCatalog>
): Promise<IPostCatalog> => {
  try {
    const res = await axios.post("/api/post-catalog", {
      name: data.name?.toLowerCase(),
    });
    return res.data.data;
  } catch (err) {
    console.error("Lỗi khi tạo danh mục:", err);
    throw new Error("Không thể tạo danh mục");
  }
};

export const updatePostCatalog = async (
  id: string,
  data: Partial<IPostCatalog>
): Promise<IPostCatalog> => {
  try {
    const res = await axios.put(`/api/post-catalog/${id}`, {
      name: data.name?.toLowerCase(),
    });
    return res.data.data;
  } catch (err) {
    console.error("Lỗi khi cập nhật danh mục:", err);
    throw new Error("Không thể cập nhật danh mục");
  }
};

export const deletePostCatalog = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/post-catalog/${id}`);
  } catch (err) {
    console.error("Lỗi khi xóa danh mục:", err);
    throw new Error("Không thể xóa danh mục");
  }
};
