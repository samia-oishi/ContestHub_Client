import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getUsers, updateUserRole } from '../../../api/adminApi'
import { EmptyState } from '../../../components/shared/EmptyState'
import { LoadingState } from '../../../components/shared/LoadingState'

const roles = ['user', 'creator', 'admin']

export function ManageUsers() {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => getUsers(page),
  })

  const mutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User role updated')
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update role'),
  })

  const users = data?.items || []
  const totalPages = data?.totalPages || 0

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        <p className="mt-1 text-sm text-base-content/70">Change user roles for dashboard access.</p>
      </div>

      {isLoading ? <LoadingState label="Loading users..." /> : null}
      {isError ? <EmptyState title="Could not load users" message="Please refresh or check your admin session." /> : null}
      {!isLoading && !isError && users.length === 0 ? <EmptyState title="No users found" message="Registered users will appear here." /> : null}

      {!isLoading && !isError && users.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img className="h-9 w-9 rounded-full object-cover" src={user.photoURL || '/favicon.svg'} alt={user.name || user.email} />
                        <span className="font-medium">{user.name || 'Unnamed user'}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td><span className="badge badge-outline capitalize">{user.role}</span></td>
                    <td>
                      <select
                        className="select select-bordered select-sm"
                        value={user.role}
                        onChange={(event) => mutation.mutate({ id: user._id, role: event.target.value })}
                        disabled={mutation.isPending}
                      >
                        {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 ? (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                <button key={item} className={`btn btn-sm ${item === page ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(item)}>
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
