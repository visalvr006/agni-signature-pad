# Agni SignaturePad

This library was generated with Angular CLI version 17.3.12.

## Attention Please

This library is under development, please don't use it in projects that is going to production in near feature. The completed version will be released by the end of March 2025.

## Install

You can get it on npm.

> npm i angular-signature-pad-agni --save

Or bower, too..

> bower i angular-signature-pad-agni

## Sample code

```html
> <form [formGroup]="signForm">
> <agni-signature-pad formControlName="signature"  [label]="'Signature'" [hasSubmitted]="isFormSubmitted" [previewEnabled]="false" [action]="'ADD'" [disabled]="false"></agni-signature-pad>
</form> 
```

As of now the signature pad supports only formcontrol, so make your code as above. The signature pad supports ADD, EDIT actions. 

## Further help

Since this is trail version, please wait for the additional features in upcoming releases. Contact as for urgent usage or custom requirements. (visalvr006@gmail.com)
