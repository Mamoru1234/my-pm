import { Component, OnInit } from '@angular/core';
import { LocalStoreService } from '../../service/local-store.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  pin = '';
  key = '';
  error$ = new BehaviorSubject<any>(null);
  constructor(
    private readonly localStoreService: LocalStoreService,
  ) { }

  ngOnInit(): void {
  }

  clear(): void {
    this.localStoreService.destroy();
  }

  create(): void {
    this.error$.next(null);
    this.localStoreService.create(this.pin)
      .then(() => console.log('created'))
      .catch((e) => this.error$.next(e));
  }

  init(): void {
    this.error$.next(null);
    this.localStoreService.init(this.pin)
      .then(() => console.log('Inited'))
      .catch((e) => this.error$.next(e));
  }

  saveKey(): void {
    this.localStoreService.saveData({ key: this.key });
  }

  loadKey(): void {
    this.key = this.localStoreService.loadData().key;
  }

  get hasStore(): boolean {
    return LocalStoreService.hasStore();
  }
}
