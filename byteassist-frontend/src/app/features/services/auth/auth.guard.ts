import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const router = inject(Router);
  const token = authService.getToken();
  const rule = userService.getUserRule();
  let url = state.url;
  console.log("rule: ", route.data?.['role']);

  if (token !== null && token !== "") {
    if (route.data?.['role'] && route.data['role'].indexOf(rule) === -1) {
      router.navigate(['/login'],
        { queryParams: { error: "Proibido o acesso a " + url } });

      // Logout
      authService.removeToken();
      userService.removeRule();
      return false;
    }
    return true;
  }
  router.navigate(['/login'],
    { queryParams: { error: "Deve fazer o login antes de acessar " + url } });

  // Logout
  authService.removeToken();
  userService.removeRule();
  return false;
};
