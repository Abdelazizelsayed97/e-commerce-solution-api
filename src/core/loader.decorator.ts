
import { Injectable, Scope } from '@nestjs/common';

export function RequestScoped(): ClassDecorator {
  return Injectable({ scope: Scope.REQUEST });
}