export interface IProfessorBase {
  userId: number;
  bio: string;
  deptId: number;
  link: string | null;
}

export interface IProfessor extends IProfessorBase {
  //   pfid is  AI no need to give expilicitly
  pfid: number;
  name: string;
  department: string;
} 