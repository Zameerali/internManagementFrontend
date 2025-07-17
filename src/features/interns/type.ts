export interface Profile {
  bio: string;
  linkedin: string;
}

export interface Intern {
  id: number;
  name: string;
  email: string;
  joined_date: string;
  profile?: Profile;
}

