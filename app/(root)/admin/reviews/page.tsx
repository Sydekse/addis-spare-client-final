'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Star, CheckCircle, X, Eye, AlertTriangle, MessageSquare } from 'lucide-react';
import { User } from '@/types/user';
import { Product } from '@/types/product';
import { getReviews } from '@/lib/api/services/review.service';
import { Review } from '@/types/review';
import { getProductById } from '@/lib/api/services/product.service';
import { findUserById } from '@/lib/api/services/user.service';

export default function ReviewModeration() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const reviews = await getReviews();
      const finReviews: Review[] = [];
      for (const review of reviews) {
        const product = await getProductById(review.productId);
        const user = await findUserById(review.userId);
        const rev = {
          ...review,
          user,
          product
        }
        finReviews.push(rev);
      }
      console.log(`fin reviews are: `, finReviews)
      setReviews(finReviews);
    }
    fetchReviews()
  }, [])

  const filteredReviews = reviews.filter((review: Review) => {
    const matchesSearch = (review.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          review.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.body.slice(0, 10).toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleApproveReview = (reviewId: string) => {
    setReviews(reviews.map(review =>
      review.id === reviewId ? { ...review, status: 'approved' } : review
    ));
  };

  const handleRejectReview = (reviewId: string) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="text-green-600">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Review Moderation</h1>
          <p className="text-muted-foreground">Manage user reviews and ratings to maintain content quality</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Reviews</Button>
          <Button variant="outline">Content Guidelines</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reported Content</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              4.5
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Management</CardTitle>
          <CardDescription>
            {filteredReviews.length} of {reviews.length} reviews shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reviews Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Review</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id} >
                    <TableCell className="max-w-xs">
                      <div>
                        <div className="font-medium truncate">{review.body.substring(0, 10)}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {review.body.substring(0, 80)}...
                        </div>                      
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.product?.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">{review.product?.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.user?.name}</div>
                        <div className="text-sm text-muted-foreground">{review.user?.email}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReview(review)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* {review.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveReview(review.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <X className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject Review</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reject this review? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleRejectReview(review.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Reject
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </> */}
                        {/* )} */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reviews found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Details Dialog */}
      {selectedReview && (
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
              <DialogDescription>
                Complete review information and moderation options
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Review Content */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Review Title</label>
                  <p className="text-sm text-muted-foreground">{selectedReview.body.substring(0, 10)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Review Content</label>
                  <p className="text-sm text-muted-foreground">{selectedReview.body}</p>
                </div>
                {/* <div className="grid grid-cols-2 gap-4">
                  {/* <div>
                    <label className="text-sm font-medium">Rating</label>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(selectedReview.rating)}
                      <span className="ml-1">({selectedReview.rating}/5)</span>
                    </div>
                  </div> */}
                  {/* <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedReview.status)}</div>
                  </div>  */}
                {/* </div> */}
              </div>

              {/* Product Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Product Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Product Name</label>
                    <p className="text-sm text-muted-foreground">{selectedReview.product?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">SKU</label>
                    <p className="text-sm text-muted-foreground font-mono">{selectedReview.product?.sku}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Customer Name</label>
                    <p className="text-sm text-muted-foreground">{selectedReview.user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{selectedReview.user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Review Date</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedReview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reporting Information
              {selectedReview.reported && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 text-red-600">Report Information</h4>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-700">This review has been reported</span>
                    </div>
                    <p className="text-sm text-red-700">{selectedReview.reportReason}</p>
                  </div>
                </div>
              )} */}

              {/* Action Buttons */}
              {/* {selectedReview.status === 'pending' && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleRejectReview(selectedReview.id);
                      setSelectedReview(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Review
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApproveReview(selectedReview.id);
                      setSelectedReview(null);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Review
                  </Button>
                </div>
              )} */}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
