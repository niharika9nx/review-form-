# Security Specification - Cosmic Event Reviews

## 1. Data Invariants
- Anyone can read reviews (publicly visible for the dashboard).
- Users can create reviews anonymously (no login required for submitting a form).
- Once a review is created, it is immutable (no updates allowed by anyone except potentially a system admin).
- No one can delete reviews except authenticated administrators.
- `rating` must be between 1 and 5.
- `name` and `review` must meet minimum length requirements.

## 2. The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Attempt to create a review with a fake admin flag.
2. **Resource Poisoning**: Use a 1MB string for the `name` field.
3. **Rating Overflow**: Set `rating` to 500.
4. **Rating Underflow**: Set `rating` to -5.
5. **Timestamp Tampering**: Provide a future timestamp from the client.
6. **Unauthorized Update**: Attempt to change the text of an existing review.
7. **Unauthorized Deletion**: Anonymous user trying to delete a review.
8. **Malicious ID**: Using a 2KB string as a document ID.
9. **Field Injection**: Adding a "isVerified: true" field to the review.
10. **Empty Review**: Submitting a review with 0 characters.
11. **Type Mismatch**: Sending `rating` as a string "5".
12. **Admin Spoofing**: Attempting to log into the admin dashboard by guessing IDs.

## 3. Test Runner (Draft)
I will implement `firestore.rules.test.ts` to verify these.
