/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  name: string;
  year: string;
  branch: string;
  review: string;
  rating: number;
  timestamp: number;
}

export const BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'Other'];
export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
