/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Attachment {
  name: string;
  size: string;
  url?: string;
}

export interface Post {
  id: string;
  index: number;
  isPinned: boolean;
  title: string;
  author: string;
  date: string;
  views: number;
  attachmentsList: Attachment[];
  contentType: 'equipment' | 'form' | 'policy';
  contentMarkdown?: string;
}

export interface Equipment {
  id: string;
  nameKo: string;
  nameEn: string;
  zeusNo: string;
  abbr?: string;
  deptCategory: 'bio' | 'efficacy' | 'maker' | 'etc';
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  status: '정상' | '점검중' | '대여불가';
  image: string;
  specs: string[];
}

export interface RentalRequest {
  id: string;
  applicantName: string;
  studentId: string;
  phone: string;
  department: string;
  advisor: string;
  purpose: string;
  rentalDate: string;
  returnDate: string;
  equipmentItemName: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  createdAt: string;
  hasSigned: boolean;
}

