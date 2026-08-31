import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schemeService, applicationService, treasuryService, userService } from '../services/api';
import { Application, Scheme, Installment, SystemUser } from '../types';

// --- USER HOOKS ---
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status, role }: { userId: string, status: SystemUser['status'], role?: SystemUser['role'] }) => 
      userService.updateUserStatus(userId, status, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// --- SCHEMES HOOKS ---
export const useSchemes = () => {
  return useQuery({
    queryKey: ['schemes'],
    queryFn: schemeService.getAllSchemes,
      refetchInterval: 5000,
  });
};

export const useCreateScheme = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: schemeService.createScheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
    },
  });
};

// --- APPLICATIONS HOOKS ---
export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: applicationService.getApplications,
      refetchInterval: 3000, // Live updates
  });
};

export const useSubmitApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationService.submitApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useVerifyApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, status, remarks, docApprovals, officerName }: { appId: string, status: string, remarks: string, docApprovals: any[], officerName?: string }) => 
      applicationService.verifyApplication(appId, status, remarks, docApprovals, officerName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useApproveApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, status, remarks, officerName }: { appId: string, status: string, remarks: string, officerName?: string }) => 
      applicationService.approveApplication(appId, status, remarks, officerName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['installments'] });
    },
  });
};

// --- DISBURSEMENT HOOKS ---
export const useInstallments = () => {
  return useQuery({
    queryKey: ['installments'],
    queryFn: treasuryService.getInstallments,
  });
};

export const useReleaseFunds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ installmentId, officerName }: { installmentId: string, officerName?: string }) => treasuryService.releaseFunds(installmentId, officerName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['installments'] });
    },
  });
};
