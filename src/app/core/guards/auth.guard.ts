import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Placeholder for auth guard logic
  return true;
};
