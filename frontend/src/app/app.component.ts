import { Component, OnInit } from '@angular/core';
import { CryptoService } from './service/crypto.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  constructor(
    private readonly cryptoService: CryptoService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    const password = 'test string';
    const data = 'Text may be any length you wish, no padding is required.';
    console.log(this.cryptoService.toArray(data));
    const salt = this.cryptoService.randomBytes(64);
    const key = await this.cryptoService.getKey(password, salt);
    let cypher = await this.cryptoService.initCypher(key);
    const dataP = this.cryptoService.toArray(data);
    const encrypted = cypher.encrypt(dataP);
    console.log(this.cryptoService.textDecoder.decode(encrypted));
    cypher = await this.cryptoService.initCypher(salt);
    console.log(this.cryptoService.textDecoder.decode(cypher.decrypt(encrypted)));
  }
}
