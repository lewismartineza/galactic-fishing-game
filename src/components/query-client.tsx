import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"


const queryClient = new QueryClient()

function QueryClientProviderWrapper({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export * from "@tanstack/react-query"
export { QueryClientProviderWrapper, queryClient }