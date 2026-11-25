export interface UserStatsByRoleDto {
  admin: number;
  landlord: number;
  tenant: number;
}

export interface UserStatsByStatusDto {
  active: number;
  locked: number;
  pendingVerification: number;
}

export interface UserStatsDto {
  totalUsers: number;
  byRole: UserStatsByRoleDto;
  byStatus: UserStatsByStatusDto;
  generatedAt: string;
}

export interface RoomsByStatusDto {
  available: number;
  occupied: number;
  maintenance: number;
}

export interface AdminDashboardDto {
  totalBuildings: number;
  pendingApprovalBuildings: number;
  rejectedBuildings: number;
  totalRooms: number;
  roomsByStatus: RoomsByStatusDto;
  occupancyRate: number;
  generatedAt: string;
}
