import { Account } from './account';
import { DEFAULT_SCRYPT, DEFAULT_SCRYPT_KEYLENGTH, ScryptOptionsEx } from './scrypt';

export class Wallet {
  static create() {
    const wallet = new Wallet();
    wallet.name = name;

    // createtime
    wallet.createTime = new Date().toISOString();
    wallet.version = '1.0';
    wallet.scrypt = DEFAULT_SCRYPT;
    wallet.keyLength = DEFAULT_SCRYPT_KEYLENGTH;

    return wallet;
  }

  static deserializeJson(obj: any) {
    if (typeof obj === 'string') {
      obj = JSON.parse(obj);
    }

    const wallet = new Wallet();
    wallet.name = obj.name;
    wallet.defaultOntid = obj.defaultOntid;
    wallet.defaultAccountAddress = obj.defaultAccountAddress;
    wallet.createTime = obj.createTime;
    wallet.version = obj.version;
    wallet.scrypt = {
      N: obj.scrypt.n,
      r: obj.scrypt.r,
      p: obj.scrypt.p,
      keyLength: obj.scrypt.dkLen
    };

    // wallet.identities = obj.identities && (obj.identities as any[]).map((i) => Identity.deserializeJson(i));
    wallet.accounts = obj.accounts && (obj.accounts as any[]).map((a) => Account.deserializeJson(a, wallet.scrypt));
    wallet.extra = obj.extra;
    return wallet;
  }

  name: string;
  defaultOntid: string;
  defaultAccountAddress: string;
  createTime: string;
  version: string;
  scrypt: ScryptOptionsEx;
  keyLength: number;
  // identities: Identity[] = [];
  accounts: Account[] = [];
  extra: null;

  addAccount(account: Account): void {
    for (const ac of this.accounts) {
      if (ac.address.equals(account.address)) {
        return;
      }
    }
    this.accounts.push(account);
  }

  delAccount(address: string) {
    this.accounts = this.accounts.filter((account) => account.address.toBase58() !== address);
  }

  setDefaultAccount(address: string): void {
    this.defaultAccountAddress = address;
  }

  setDefaultIdentity(ontid: string): void {
    this.defaultOntid = ontid;
  }

  /**
   * Serializes to JSON object.
   *
   *
   */
  serializeJson(stringify: boolean = false): any {
    const obj = {
      name: this.name,
      defaultOntid: this.defaultOntid,
      defaultAccountAddress: this.defaultAccountAddress,
      createTime: this.createTime,
      version: this.version,
      scrypt: this.scrypt,
      // identities: this.identities.map((i) => i.serializeJson(false)),
      accounts: this.accounts.map((a) => a.serializeJson(false)),
      extra: null
    };

    if (stringify) {
      return JSON.stringify(obj);
    } else {
      return obj;
    }
  }
}
