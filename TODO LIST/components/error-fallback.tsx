"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface ErrorFallbackProps {
  message?: string
  onRetry?: () => void
}

export function ErrorFallback({ message = "Something went wrong", onRetry }: ErrorFallbackProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-red-50 border-b border-red-100">
        <CardTitle className="text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Error
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-gray-700">{message}</p>
        <p className="text-sm text-gray-500 mt-2">
          This could be due to a network issue or missing environment variables. Please check your configuration and try
          again.
        </p>
      </CardContent>
      {onRetry && (
        <CardFooter className="border-t pt-4">
          <Button onClick={onRetry} variant="outline" className="w-full">
            Try Again
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
