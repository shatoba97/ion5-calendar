import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export class DestroyableBase implements OnDestroy {
  public destroy = new Subject();

  /*@inheritdoc */
  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
